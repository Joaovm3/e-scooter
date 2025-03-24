import { api } from '@/lib/api';
import { User } from '@/types/auth';

const PATH = 'auth';

const findOrCreateUser = async (user: User) => {
  try {
    const googleUser = {
      email: user.email,
      username: user.name,
      picture: user.picture,
      googleId: user.id,
      token: user.token,
    };
    const response = await api.post(`${PATH}/google`, googleUser);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { findOrCreateUser };
