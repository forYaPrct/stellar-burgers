import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { profileOrders } from '../../services/slices/profile-orders-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.profileOrders.order);
  useEffect(() => {
    dispatch(profileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
