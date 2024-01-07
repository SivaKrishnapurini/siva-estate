import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const Contact = () => {
    const currentDate = new Date();
    const {currentUser} = useSelector((state)=>state.user)
    const currentYear = currentDate.getFullYear();
    const [commentFormData, setCommentFormData] = useState({
        name:'',
        email:'',
        message:''
    })

    const onCommentInput =(e) =>{
        setCommentFormData({
            ...commentFormData,
            [e.target.id]:e.target.value
        })
    }

    const onCommentSubmit = async (e) =>{
        e.preventDefault()
        try {
            const commmentMethod ={
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(commentFormData)
            }
            const commentData = await fetch(`/listing/datas/messages/${currentUser._id}`,commmentMethod)
            const commentDataResponse = await commentData.json()
            if(commentDataResponse.success === false){
                toast.error(commentDataResponse.message)
                return
            }
            toast.success(commentDataResponse)
            setCommentFormData({
                name:'',
                email:'',
                message:''
            })

        } catch (error) {
            toast.error(error.message)
        }

    }

  return (
    <div className="bg-gray-100 font-sans">
      <header className="text-gray-800 py-4 text-center">
        <h1 className="text-4xl font-semibold">Contact Us</h1>
        <p className="mt-2">Thank you for visiting the Siva Estate Project.</p>
      </header>

      <main className="container mx-auto py-8 md:w-[500px] w-[350px] shadow-lg md:p-10 p-5 rounded-md bg-gray-200">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-600">Contact Information</h2>
          <p className="mb-2"><strong className='text-slate-700'>Phone:</strong> -</p>
          <p className="mb-2"><strong className='text-slate-700'>Email:</strong> sivakrishnap753@gmail.com</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 text-center">Contact Form</h2>
          <form className="space-y-4" onSubmit={onCommentSubmit}>
            <label htmlFor="name" className="block">
              Name:
              <input type="text" id="name" name="name" value={commentFormData.name} required className="block w-full border-gray-300 rounded-md p-2" onChange={onCommentInput}/>
            </label>

            <label htmlFor="email" className="block">
              Email:
              <input type="email" id="email" name="email" value={commentFormData.email} required className="block w-full border-gray-300 rounded-md p-2" onChange={onCommentInput}/>
            </label>

            <label htmlFor="message" className="block">
              Message:
              <textarea id="message" name="message" rows="4" required value={commentFormData.message} className="block w-full border-gray-300 rounded-md p-2" onChange={onCommentInput}></textarea>
            </label>

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
          <ToastContainer />
          </form>
        </section>
      </main>

      <footer className="bg-slate-400 text-white text-center py-4 mt-8">
        <p>© {currentYear} Siva Estate Project</p>
        <p className="text-blue-500 font-semibold hover:text-white">Privacy Policy</p>
      </footer>
    </div>
  );
}

export default Contact;
