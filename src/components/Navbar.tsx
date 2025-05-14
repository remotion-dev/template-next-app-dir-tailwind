'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Nav() {
//   const { user, signOut } = useAuth();
const user = null;
const signOut = () => {};

  return (
<nav className="fixed left-1/2 -translate-x-1/2 z-50 w-full
     flex justify-between items-center py-4 px-6 md:px-12 lg:px-20 
     bg-white/10 backdrop-blur-lg border border-b border-t-0 border-l-0 border-r-0 border-white/20 
     shadow-xl">

      <div className='max-w-7xl justify-between w-full flex'>

      <div className="flex max-w-7xl items-center">
        <Link href="/">
          <div className="bg-white text-black font-bold px-4 py-2 rounded-full cursor-pointer transition hover:opacity-90">
            <span className="">
              <span className="text-red-800">tanglish</span>captions.com
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>   
            <button
              onClick={signOut}
              className="bg-yellow-300 px-6 py-2.5 cursor-pointer rounded-full text-sm font-medium hover:opacity-90 transition"
            >
            <span className='text-black'>Sign out</span> 
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition">
              <Image  
                src={user?.identities[0].identity_data.avatar_url || "/default-avatar.png"} 
                alt="User Avatar" 
                className="w-8 h-8 rounded-full border border-black"
              />
              <span className="text-sm md:block hidden font-medium text-black">{user?.identities[0].identity_data.name || "Profile"}</span>
            </Link>
          </>
        ) : (
          <Link href="/login">
            <button className="bg-yellow-300 cursor-pointer text-black px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
              Sign up
            </button>
          </Link>
        )}
      </div>

      </div>
    </nav>
  );
}
