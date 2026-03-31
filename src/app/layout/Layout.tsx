import { MapView } from '../../components/core/MapView/MapView';
import { BottomSheetHost } from '../../components/core/BottomSheetHost/BottomSheetHost';
import { ActiveReservationPill } from '../../components/core/ActiveReservationPill/ActiveReservationPill';

export const Layout = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ActiveReservationPill />
      <MapView />
      <BottomSheetHost />
    </div>
  );
};
