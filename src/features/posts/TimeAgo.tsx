import { parseISO, formatDistanceToNow } from "date-fns"

type PropsType = {
  timeStamp: string
}

const TimeAgo = ({ timeStamp }: PropsType) => {
  let timeAgo = ""
  if (timeStamp) {
    const date = parseISO(timeStamp)
    const timePeriod = formatDistanceToNow(date)
    timeAgo = `${timePeriod} ago`
  }

  return (
    <span title={timeStamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  )
}
export default TimeAgo
