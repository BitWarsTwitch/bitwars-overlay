const avatarMap = new Map([
  [1, "/avatars/spear.gif"],
  [2, "/avatars/ball.gif"],
  [3, "/avatars/walker.gif"],
  [4, "/avatars/bat.gif"],
  [5, "/avatars/bomber.gif"],
  [6, "/avatars/ufo.gif"],
  [7, "/avatars/slug.gif"],
  [8, "/avatars/glizzy.gif"],
]);

export function getAvatarPath(id) {
  return avatarMap.get(id) || "/avatars/walker.gif";
}
