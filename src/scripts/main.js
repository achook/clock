const m = require('mithril')

function setLeadingZero(number) {
  if (typeof number === 'string' || typeof number === 'number') {
    number = parseInt(number)
    if (number < 10) return '0' + number
    return number
  } else {
    console.error('Argument provided to function setLeadingZero must be string or number')
    return undefined
  }
  
}

function setTime() {
  let date = new Date()

  let timedate = {
    time: {
      divider: ':',
      data: {
        hour: setLeadingZero(date.getHours()),
        minute: setLeadingZero(date.getMinutes()),
        seconds: setLeadingZero(date.getSeconds())
      }
    },
    date: {
      divider: '.',
      data: {
        day: date.getDate(),
        month: setLeadingZero(date.getMonth() + 1),
        year: date.getFullYear()
      }
    }
  }

  let blocksArray = []

  for (let block in timedate) {
    let elementsArray = []
    let first = true;
    let divider = timedate[block].divider

    for (let element in timedate[block].data) {
      let toArray

      if (first) {
        first = false
      } else {
        elementsArray.push(m('span', { class: '${block} ${block}--divider' }, timedate[block].divider))
      }
      elementsArray.push(m('span', { class: '${block} ${block}--${element}' }, timedate[block].data[element]))
    }

    blocksArray.push(
      m('p', { class: block }, elementsArray)
    )
  }

  m.render(document.body, m('div', { id: 'clock' }, blocksArray))
}

setInterval(setTime, 50)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
}
