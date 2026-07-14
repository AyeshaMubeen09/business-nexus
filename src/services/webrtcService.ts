class WebrtcService {
  private peer: RTCPeerConnection | null = null;

  private pendingCandidates: RTCIceCandidateInit[] = [];

  /* ==========================================
     CREATE PEER
  ========================================== */

  createPeer() {
    if (this.peer) return this.peer;

    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    return this.peer;
  }

  getPeer() {
    return this.peer;
  }

  /* ==========================================
     OFFER
  ========================================== */

  async createOffer() {
    if (!this.peer) return null;

    if (this.peer.signalingState !== "stable") {
      return null;
    }

    const offer = await this.peer.createOffer();

    await this.peer.setLocalDescription(offer);

    return offer;
  }

  /* ==========================================
     ANSWER
  ========================================== */

  async createAnswer(
    offer: RTCSessionDescriptionInit
  ) {
    if (!this.peer) return null;

    await this.peer.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    await this.flushPendingCandidates();

    const answer =
      await this.peer.createAnswer();

    await this.peer.setLocalDescription(answer);

    return answer;
  }

  /* ==========================================
     REMOTE ANSWER
  ========================================== */

  async setRemoteAnswer(
    answer: RTCSessionDescriptionInit
  ) {
    if (!this.peer) return;

    if (
      this.peer.signalingState !==
      "have-local-offer"
    ) {
      return;
    }

    await this.peer.setRemoteDescription(
      new RTCSessionDescription(answer)
    );

    await this.flushPendingCandidates();
  }

  /* ==========================================
     ICE
  ========================================== */

  async addIceCandidate(
    candidate: RTCIceCandidateInit
  ) {
    if (!this.peer) return;

    if (!this.peer.remoteDescription) {
      this.pendingCandidates.push(candidate);
      return;
    }

    try {
      await this.peer.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error(error);
    }
  }

  private async flushPendingCandidates() {
    if (!this.peer) return;

    while (this.pendingCandidates.length) {
      const candidate =
        this.pendingCandidates.shift();

      if (!candidate) continue;

      try {
        await this.peer.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  /* ==========================================
     HELPERS
  ========================================== */

  isStable() {
    return (
      this.peer &&
      this.peer.signalingState === "stable"
    );
  }

  /* ==========================================
     CLOSE
  ========================================== */

  close() {
    this.pendingCandidates = [];

    if (this.peer) {
      this.peer.close();
      this.peer = null;
    }
  }
}

export default new WebrtcService();