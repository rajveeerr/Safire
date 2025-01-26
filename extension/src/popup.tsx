import { CustomButton } from "~ui/custom-button"

import "~style.css"

function IndexPopup() {
  return (
    <div className="plasmo-h-16 plasmo-w-40">
      <CustomButton text="Generate Report" />
      <CustomButton text="Contact Cybercrime Helpline" />
    </div>
  )
}

export default IndexPopup
