import React from 'react';
import AppRouter from './routers/app router/AppRouter';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <section className='min-h-screen bg-slate-900 relative flex items-center justify-center p-1 overflow-hidden'>
      <div className='absolute inset-0 bg-[linerar-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]  ' />
      <div className='absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]' />

      <div className='absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]' />

      <div className='z-20 w-full'>
        <AppRouter />
      </div>

      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 2000,
          style: {
            background: "#1e293b",
            color: "#fff",
          }
        }}
      />
    </section>
  )
}

export default App
