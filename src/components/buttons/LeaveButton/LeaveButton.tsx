import styles from '../LeaveButton/LeaveButton.module.css'

interface LeaveButtonProps {
  onLeave: () => void
}

export const LeaveButton: React.FC<LeaveButtonProps> = ({ onLeave }) => {
  return (
    <button className={styles.leaveButton} onClick={ onLeave }>
      <div className={styles.door}>
        <div className={styles.doorFrame}></div>
        <div className={styles.doorPanel}></div>
      </div>
    </button>
  )
}