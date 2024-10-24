const avatarMap = new Map([
  [1, "/avatars/walker.gif"],
  [2, "/avatars/ufo.gif"],
  [3, "/avatars/walker.gif"],
  [4, "/avatars/walker.gif"],
  [5, "/avatars/walker.gif"],
  [6, "/avatars/walker.gif"],
  [7, "/avatars/walker.gif"],
  [8, "/avatars/walker.gif"],
  [9, "/avatars/walker.gif"],
]);

export function getAvatarPath(id) {
  return avatarMap.get(id) || "/avatars/walker.gif";
}
