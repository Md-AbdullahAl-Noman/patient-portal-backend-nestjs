import React from 'react'

export default function Footer() {
  return (
    <>
       <footer className="bg-custombg text-white text-center p-4">
      <p className="text-sm">
        © {new Date().getFullYear()} Hospital Portal. All rights reserved.
      </p>
    </footer>
    </>
  )
}
