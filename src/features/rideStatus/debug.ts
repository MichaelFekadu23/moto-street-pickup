// Utility to test WebSocket connection with detailed logging
export function testWebSocketConnection(
  url: string
): Promise<{ success: boolean; error?: string; closeCode?: number }> {
  return new Promise((resolve) => {
    console.log("🔍 Testing WebSocket connection to:", url);

    const ws = new WebSocket(url);
    let opened = false;
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      console.warn("⏰ Connection test timeout after 10 seconds");
      try { ws.close(); } catch {}
    }, 10000);

    ws.onopen = () => {
      opened = true;
      console.log("✅ Test connection successful (will close)");
      // Close immediately after success, but resolve ONLY after onclose
      try { ws.close(1000, "test complete"); } catch {}
    };

    ws.onerror = (event) => {
      if (timedOut) return; // onclose will handle resolve
      console.error("❌ Test connection error:", event);
      clearTimeout(timeout);
      // We still wait for onclose to avoid racing with main WS
    };

    ws.onclose = (event) => {
      clearTimeout(timeout);
      console.log("🔌 Test connection closed:", event.code, event.reason);
      if (opened && event.code === 1000) {
        resolve({ success: true });
      } else if (timedOut) {
        resolve({ success: false, error: "Connection timeout" });
      } else {
        resolve({
          success: false,
          error: `Closed with code ${event.code}`,
          closeCode: event.code,
        });
      }
    };
  });
}

// Check if WebSocket is supported and log browser info
export function checkWebSocketSupport(): boolean {
  const isSupported = "WebSocket" in window;
  console.log("🌐 Browser WebSocket support:", isSupported);
  console.log("🔧 User Agent:", navigator.userAgent);
  if (!isSupported) {
    console.error("❌ WebSocket is not supported in this browser");
    return false;
  }
  return true;
}

// Enhanced WebSocket creation with browser-specific fixes
export function createWebSocket(url: string): WebSocket {
  console.log("🔧 Creating WebSocket with URL:", url);
  if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
    throw new Error("Invalid WebSocket URL protocol");
  }
  const ws = new WebSocket(url);
  ws.binaryType = "arraybuffer";
  return ws;
}
