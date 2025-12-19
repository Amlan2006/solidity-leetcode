import { SignIn } from '@clerk/nextjs';

const page = () => {
  return (
    <div className='w-full h-[95vh] flex items-center justify-center'>
       <SignIn  routing="hash" />
    </div>
  )
}

export default page
