import { MapView } from '../../components/core/MapView/MapView';
import { BottomSheetHost } from '../../components/core/BottomSheetHost/BottomSheetHost';

export const Layout = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapView />
      <BottomSheetHost />
    </div>
  );
};
