import { API_ENDPOINTS, buildInterviewWsUrl, buildApiUrl, INTERVIEW_SERVICE_URL } from './api-config.js';

class InterviewService {
    constructor() {
        this.sessionId = null;
        this.audioWs = null;
        this.videoWs = null;
        this.audioContext = null;
        this.mediaStream = null;
        this.audioProcessor = null;
        this.isRecording = false;
        this.isMuted = false;
        this.isVideoEnabled = true;
        
        // Callbacks
        this.onTranscriptUpdate = null;
        this.onEvaluationUpdate = null;
        this.onProctoringAlert = null;
        this.onStatusUpdate = null;
        this.onError = null;
    }

    /**
     * Start interview session
     */
    async startSession(candidateData) {
        try {
            const response = await fetch(`${INTERVIEW_SERVICE_URL}${API_ENDPOINTS.ai.interview.start}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(candidateData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to start session');
            }

            const data = await response.json();
            this.sessionId = data.session_id;
            
            return data;
        } catch (error) {
            console.error('Failed to start session:', error);
            if (this.onError) this.onError(error);
            throw error;
        }
    }

    /**
     * Get session status
     */
    async getStatus() {
        if (!this.sessionId) throw new Error('No active session');
        
        try {
            const response = await fetch(`${INTERVIEW_SERVICE_URL}${API_ENDPOINTS.ai.interview.status(this.sessionId)}`);
            if (!response.ok) throw new Error('Failed to get status');
            return await response.json();
        } catch (error) {
            console.error('Failed to get status:', error);
            throw error;
        }
    }

    /**
     * Get evaluation
     */
    async getEvaluation() {
        if (!this.sessionId) throw new Error('No active session');
        
        try {
            const response = await fetch(`${INTERVIEW_SERVICE_URL}${API_ENDPOINTS.ai.interview.evaluation(this.sessionId)}`);
            if (!response.ok) throw new Error('Failed to get evaluation');
            return await response.json();
        } catch (error) {
            console.error('Failed to get evaluation:', error);
            throw error;
        }
    }

    /**
     * End interview session
     */
    async endSession() {
        if (!this.sessionId) throw new Error('No active session');
        
        try {
            // Close WebSocket connections
            this.disconnectAudio();
            this.disconnectVideo();
            
            // Stop media streams
            this.stopMediaStream();
            
            // End session on server
            const response = await fetch(`${INTERVIEW_SERVICE_URL}${API_ENDPOINTS.ai.interview.end(this.sessionId)}`, {
                method: 'POST',
            });
            
            if (!response.ok) throw new Error('Failed to end session');
            
            const data = await response.json();
            this.sessionId = null;
            
            return data;
        } catch (error) {
            console.error('Failed to end session:', error);
            throw error;
        }
    }

    /**
     * Connect audio WebSocket for live interview
     */
    async connectAudio() {
        if (!this.sessionId) throw new Error('No active session');
        if (this.audioWs) return; // Already connected

        const wsUrl = buildInterviewWsUrl(API_ENDPOINTS.ai.interview.live(this.sessionId));
        this.audioWs = new WebSocket(wsUrl);

        this.audioWs.onopen = () => {
            console.log('Audio WebSocket connected');
            this.startAudioCapture();
        };

        this.audioWs.onmessage = async (event) => {
            if (event.data instanceof Blob) {
                // Audio data from Gemini
                await this.handleAudioResponse(event.data);
            } else {
                // JSON messages
                const data = JSON.parse(event.data);
                await this.handleAudioMessage(data);
            }
        };

        this.audioWs.onerror = (error) => {
            console.error('Audio WebSocket error:', error);
            if (this.onError) this.onError(error);
        };

        this.audioWs.onclose = () => {
            console.log('Audio WebSocket closed');
            this.audioWs = null;
        };
    }

    /**
     * Handle audio WebSocket messages
     */
    async handleAudioMessage(data) {
        switch (data.type) {
            case 'ready':
                console.log('Interview ready');
                break;
            case 'transcript':
                if (this.onTranscriptUpdate) {
                    this.onTranscriptUpdate({
                        role: 'interviewer',
                        text: data.text,
                        timestamp: new Date(),
                    });
                }
                break;
            case 'turn_complete':
                console.log('AI turn complete');
                break;
            case 'evaluation_update':
                if (this.onEvaluationUpdate && data.evaluation) {
                    this.onEvaluationUpdate(data.evaluation);
                }
                break;
            case 'error':
                console.error('Server error:', data.message);
                if (this.onError) this.onError(new Error(data.message));
                break;
        }
    }

    /**
     * Handle audio response (playback)
     */
    async handleAudioResponse(audioBlob) {
        try {
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.audioContext.destination);
            source.start();
        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    }

    /**
     * Start audio capture from microphone
     */
    async startAudioCapture() {
        try {
            // Check if we have a pre-existing media stream from initialization
            if (window._tempMediaStream) {
                this.mediaStream = window._tempMediaStream;
                console.log('Using pre-authorized media stream');
                delete window._tempMediaStream; // Clean up
            }

            // Initialize audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000, // Gemini Live requires 16kHz
            });

            // Get user media if not already available
            if (!this.mediaStream) {
                this.mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleRate: 16000,
                        channelCount: 1,
                        echoCancellation: true,
                        noiseSuppression: true,
                    },
                    video: false,
                });
            }

            // Create audio processor
            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
                if (!this.isMuted && this.audioWs && this.audioWs.readyState === WebSocket.OPEN) {
                    const inputData = e.inputBuffer.getChannelData(0);
                    // Convert Float32 to Int16 PCM
                    const int16Data = new Int16Array(inputData.length);
                    for (let i = 0; i < inputData.length; i++) {
                        const s = Math.max(-1, Math.min(1, inputData[i]));
                        int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    }
                    this.audioWs.send(int16Data.buffer);
                }
            };

            source.connect(processor);
            processor.connect(this.audioContext.destination);
            this.audioProcessor = processor;
            this.isRecording = true;

            console.log('✅ Audio capture started successfully');

        } catch (error) {
            console.error('Failed to start audio capture:', error);
            if (this.onError) this.onError(error);
        }
    }

    /**
     * Send user transcript to server
     */
    sendUserTranscript(text) {
        if (this.audioWs && this.audioWs.readyState === WebSocket.OPEN) {
            this.audioWs.send(JSON.stringify({
                type: 'user_transcript',
                text: text,
            }));
            
            if (this.onTranscriptUpdate) {
                this.onTranscriptUpdate({
                    role: 'candidate',
                    text: text,
                    timestamp: new Date(),
                });
            }
        }
    }

    /**
     * Disconnect audio WebSocket
     */
    disconnectAudio() {
        if (this.audioWs) {
            this.audioWs.close();
            this.audioWs = null;
        }
        this.stopAudioCapture();
    }

    /**
     * Stop audio capture
     */
    stopAudioCapture() {
        if (this.audioProcessor) {
            this.audioProcessor.disconnect();
            this.audioProcessor = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.isRecording = false;
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    /**
     * Connect video WebSocket for proctoring
     */
    async connectVideo() {
        if (!this.sessionId) throw new Error('No active session');
        if (this.videoWs) return; // Already connected

        const wsUrl = buildInterviewWsUrl(API_ENDPOINTS.ai.interview.video(this.sessionId));
        this.videoWs = new WebSocket(wsUrl);

        this.videoWs.onopen = () => {
            console.log('Video WebSocket connected');
            this.startVideoCapture();
        };

        this.videoWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleVideoMessage(data);
        };

        this.videoWs.onerror = (error) => {
            console.error('Video WebSocket error:', error);
            if (this.onError) this.onError(error);
        };

        this.videoWs.onclose = () => {
            console.log('Video WebSocket closed');
            this.videoWs = null;
        };
    }

    /**
     * Handle video WebSocket messages (proctoring alerts)
     */
    handleVideoMessage(data) {
        if (data.type === 'proctoring_alert' && this.onProctoringAlert) {
            this.onProctoringAlert({
                type: data.alert_type,
                message: data.message,
                severity: data.severity || 'warning',
                timestamp: new Date(),
            });
        }
    }

    /**
     * Start video capture and stream to server
     */
    async startVideoCapture() {
        try {
            // Check if we have a pre-existing media stream from initialization
            if (window._tempMediaStream) {
                this.mediaStream = window._tempMediaStream;
                console.log('Using pre-authorized media stream for video');
            }

            if (!this.mediaStream) {
                this.mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 30 },
                    },
                });
            } else {
                // Add video track if not already present
                const videoTracks = this.mediaStream.getVideoTracks();
                if (videoTracks.length === 0) {
                    const videoStream = await navigator.mediaDevices.getUserMedia({ 
                        video: {
                            width: { ideal: 640 },
                            height: { ideal: 480 },
                            frameRate: { ideal: 30 },
                        }
                    });
                    videoStream.getVideoTracks().forEach(track => {
                        this.mediaStream.addTrack(track);
                    });
                }
            }

            // Update video element
            const videoElement = document.getElementById('user-camera-feed');
            if (videoElement && videoElement.tagName === 'VIDEO') {
                videoElement.srcObject = this.mediaStream;
                videoElement.play().catch(console.error);
                console.log('✅ Video preview updated');
            }

            // Send video frames to server
            this.startVideoStreaming();

            console.log('✅ Video capture and streaming started successfully');

        } catch (error) {
            console.error('Failed to start video capture:', error);
            if (this.onError) this.onError(error);
        }
    }

    /**
     * Stream video frames to server
     */
    startVideoStreaming() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const videoElement = document.getElementById('user-camera-feed');
        
        if (!videoElement || videoElement.tagName !== 'VIDEO') {
            console.error('Video element not found or not a video element');
            return;
        }

        let frameCount = 0;

        const sendFrame = () => {
            if (this.videoWs && this.videoWs.readyState === WebSocket.OPEN && this.isVideoEnabled) {
                if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    ctx.drawImage(videoElement, 0, 0);
                    
                    canvas.toBlob((blob) => {
                        if (blob && this.videoWs && this.videoWs.readyState === WebSocket.OPEN) {
                            this.videoWs.send(blob);
                            frameCount++;
                            
                            // Log every 20 frames (10 seconds at 2 FPS)
                            if (frameCount % 20 === 0) {
                                console.log(`📹 Sent ${frameCount} video frames to proctoring service`);
                            }
                        }
                    }, 'image/jpeg', 0.8);
                }
            }
        };

        // Send frames at ~2 FPS for proctoring
        this.videoInterval = setInterval(sendFrame, 500);
        console.log('✅ Video frame streaming started (2 FPS)');
    }

    /**
     * Toggle video
     */
    toggleVideo() {
        this.isVideoEnabled = !this.isVideoEnabled;
        
        const videoElement = document.getElementById('user-camera-feed');
        const cameraOffElement = document.getElementById('user-camera-off');
        
        if (videoElement && cameraOffElement) {
            if (this.isVideoEnabled) {
                cameraOffElement.classList.add('hidden');
            } else {
                cameraOffElement.classList.remove('hidden');
            }
        }
        
        return this.isVideoEnabled;
    }

    /**
     * Disconnect video WebSocket
     */
    disconnectVideo() {
        if (this.videoInterval) {
            clearInterval(this.videoInterval);
            this.videoInterval = null;
        }
        if (this.videoWs) {
            this.videoWs.close();
            this.videoWs = null;
        }
    }

    /**
     * Stop all media streams
     */
    stopMediaStream() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        this.stopAudioCapture();
        this.disconnectVideo();
    }

    /**
     * Update session status periodically
     */
    startStatusUpdates(intervalMs = 5000) {
        if (this.statusInterval) return;
        
        this.statusInterval = setInterval(async () => {
            try {
                const status = await this.getStatus();
                if (this.onStatusUpdate) {
                    this.onStatusUpdate(status);
                }
            } catch (error) {
                console.error('Failed to update status:', error);
            }
        }, intervalMs);
    }

    /**
     * Stop status updates
     */
    stopStatusUpdates() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
        }
    }
}

// Export singleton instance
export const interviewService = new InterviewService();
export default interviewService;