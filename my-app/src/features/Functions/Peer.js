class PeerService {
  constructor() {
    this.initializePeer();
  }

  initializePeer() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

      // Add event listeners for state changes
      this.peer.addEventListener("iceconnectionstatechange", () => {
        console.log(`ICE connection state: ${this.peer.iceConnectionState}`);
      });

      this.peer.addEventListener("signalingstatechange", () => {
        console.log(`Signaling state: ${this.peer.signalingState}`);
      });

      this.peer.addEventListener("connectionstatechange", () => {
        console.log(`Connection state: ${this.peer.connectionState}`);
      });
    }
  }

  async getAnswer(offer) {
    if (offer) {
      if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(ans));
        return ans;
      }
    }
    return null;
  }

  async setLocalDescription(ans) {
    if (this.peer && ans) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
    return null;
  }

  closeConnection() {
    if (this.peer) {
      this.peer.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });

      this.peer.getReceivers().forEach((receiver) => {
        if (receiver.track) {
          receiver.track.stop();
        }
      });

      this.peer.close();
      this.peer = null;
    }
  }
}

export default new PeerService();
