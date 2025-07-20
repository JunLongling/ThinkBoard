export function getAnonymousUserId() {
  let userId = localStorage.getItem("anonymousUserId");
  if (!userId) {
    userId = `anon_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem("anonymousUserId", userId);
  }
  return userId;
}