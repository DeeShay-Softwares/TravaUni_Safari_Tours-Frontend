import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

export default function GroupAvatars() {
  return (
    <AvatarGroup max={4} sx={{justifyContent: 'left'}}>
      <Avatar sizes='20' alt="Remy Sharp" src='https://images.unsplash.com/photo-1520962880247-cfaf541c8724' />
      <Avatar alt="Travis Howard" src='https://images.unsplash.com/photo-1536152470836-b943b246224c' />
      <Avatar alt="Cindy Baker" src='https://images.unsplash.com/photo-1504851149312-7a075b496cc7' />
      <Avatar alt="Agnes Walker" src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3" />
    </AvatarGroup>
  );
}
