import { useUI } from '../../context/UIContext'
import AuthModal from './AuthModal'
import TopicModal from './TopicModal'
import TopicViewModal from './TopicViewModal'
import NewsModal from './NewsModal'
import NewsViewModal from './NewsViewModal'
import RateModal from './RateModal'
import EditProfileModal from './EditProfileModal'
import BuildingModal from './BuildingModal'
import RatingModal from './RatingModal'
import AboutModal from './AboutModal'
import SettingsModal from './SettingsModal'
import ConfirmDialog from '../ConfirmDialog'

const map = { auth: AuthModal, topic: TopicModal, topicView: TopicViewModal, news: NewsModal, newsView: NewsViewModal, rate: RateModal, editProfile: EditProfileModal, building: BuildingModal, ratingForm: RatingModal, about: AboutModal, settings: SettingsModal }

export default function ModalHost() {
  const { modal, closeModal } = useUI()
  const C = map[modal.name]
  return <>{C && <C {...modal.props} open={modal.open} onClose={closeModal} />}<ConfirmDialog /></>
}
