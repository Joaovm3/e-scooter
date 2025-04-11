import { api } from '@/lib/api';
import { GoogleUser, User } from '@/types/auth';

const PATH = 'auth';

const findOrCreateUser = async (user: GoogleUser) => {
  try {
    const googleUser = {
      email: user.email,
      name: user.name,
      picture: user.picture,
      googleId: user.id,
      token: user.token,
    };

    const response = await api.post<User>(`${PATH}/google`, googleUser);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { findOrCreateUser };
