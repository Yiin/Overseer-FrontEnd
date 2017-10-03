export default (el) => {
  const containerHeight = el.scrollHeight - el.getBoundingClientRect().height
  const speed = 1500
  let start = null

  const scroll = (timestamp) => {
    const distance = containerHeight - el.scrollTop

    if (distance <= 0) {
      return
    }
    if (!start) {
      start = timestamp
    }
    const diffInTime = timestamp - start

    el.scrollTop += (diffInTime / speed * 1000)
    if (el.scrollTop >= containerHeight) {
      el.scrollTop = containerHeight
    } else {
      window.requestAnimationFrame(scroll)
    }
    start = timestamp
  }
  window.requestAnimationFrame(scroll)
}
