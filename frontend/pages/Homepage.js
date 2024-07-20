import React from 'react';
import { useRouter } from 'next/router';
import PostList from '@/components/PostList';

const Homepage = () => {
  const router = useRouter();
  const { name } = router.query;

  return (
    <div>
      <div className="content">
        <h1>Homepage</h1>
        <PostList />
      </div>
    </div>
  );
};

export default Homepage;
