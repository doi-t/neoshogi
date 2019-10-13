export default function({ store, route, redirect }) {
  const user = store.state.users.user
  const blockedRoute = /\/(game|mypage)\/*/g
  const homeRoute = "/"

  if (!user && route.path.match(blockedRoute)) {
    redirect("/")
  }

  if (user && route.path === homeRoute) {
    redirect("/game")
  }
}