"use client";
import React from "react";
import { motion } from "framer-motion";
import { Music, Play, Instagram, Sparkles } from "lucide-react";

const testimonials = [
  {
    image: "https://images.unsplash.com/photo-1673505411900-f6b228603625?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "let it fly.🔥",
    song: "Zendegi a raha hu main",
    artist: "Atif Aslam",
    size: "small",
  },{
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000",
    caption: "Sunset state of mind 🌅 #goldenhour",
    song: "Golden Hour",
    artist: "JVKE",
    size: "large", // This will span more columns for the Bento effect
  },
  {
    image: "https://images.unsplash.com/photo-1506790144-fe3c68e4247d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "Not just a vibe, it's a lifestyle. ✨",
    song: "Starboy",
    artist: "The Weeknd",
    size: "small",
  },
  
];

export default function TestimonialSection() {
  return (
    <section className="relative w-full bg-[#050505] text-white py-24 px-6 lg:px-12 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-rose-500 font-bold tracking-widest uppercase text-xs mb-4">
              <Sparkles size={14} /> <span>Social Proof</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
              Viral <span className="text-white/40 italic">Results.</span>
            </h2>
          </div>
          <p className="text-lg text-white/50 max-w-sm border-l border-rose-500/50 pl-6">
            From random clicks to viral hits. See how the Jhakkas Engine transforms everyday moments.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group relative overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 shadow-2xl ${
                item.size === "large" ? "md:col-span-7 md:row-span-2" : "md:col-span-5 md:row-span-1"
              }`}
            >
              {/* IMAGE CONTAINER */}
              <img 
                src={item.image} 
                alt="Vibe" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.7] group-hover:brightness-50" 
              />

              {/* OVERLAY CONTENT */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
                
                {/* Instagram Style Label */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                  <Instagram size={12} /> Generated Caption
                </div>

                <div className="space-y-4">
                  <p className={`font-medium tracking-tight ${item.size === 'large' ? 'text-3xl' : 'text-xl'}`}>
                    "{item.caption}"
                  </p>

                  {/* MUSIC PILL */}
                  <div className="flex items-center justify-between group/pill">
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 p-2 pr-6 rounded-full hover:bg-white/10 transition cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-l from-[#f97316] via-[#e11d48] to-[#ef4444] flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Play size={16} fill="white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none mb-1 uppercase tracking-tighter">{item.song}</p>
                        <p className="text-[10px] text-white/40 font-medium">{item.artist}</p>
                      </div>
                    </div>
                    
                    <Music className="text-white/20 group-hover:text-blue-500 transition-colors" size={24} />
                  </div>
                </div>
              </div>

              {/* HOVER GLOW EFFECT */}
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}












// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import { Quote, Music } from "lucide-react";

// const testimonials = [
//   {
//     image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000",
//     caption: "Sunset state of mind 🌅 #goldenhour",
//     song: "Golden Hour - JVKE"
//   },
//   {
//     image: "https://images.unsplash.com/photo-1529139574466-a302d2052574?q=80&w=1000",
//     caption: "Not just a vibe, it's a lifestyle. ✨",
//     song: "Starboy - The Weeknd"
//   },
//   {
//     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000",
//     caption: "Ekhon amar time. 🇧🇩🔥",
//     song: "Habibi - Ricky Rich"
//   }
// ];

// export default function TestimonialSection() {
//   return (
//     <section className="w-full bg-[#f5f5f7] text-black py-24 px-6 lg:px-12">
//       <div className="max-w-7xl mx-auto">
        
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
//             See the Magic
//           </h2>
//           <p className="text-lg text-black/60 max-w-2xl mx-auto">
//             From random clicks to viral hits. Check out what Jhakkas AI is creating.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {testimonials.map((item, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white rounded-3xl p-4 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1 transition duration-300"
//             >
//               <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 filter contrast-[1.05]">
//                 <img src={item.image} alt="Testimonial" className="w-full h-full object-cover" />
//               </div>
              
//               <div className="space-y-4 px-2">
//                 <div className="relative pl-6">
//                   <Quote className="absolute left-0 top-0 w-4 h-4 text-blue-500 opacity-50" />
//                   <p className="text-lg font-medium leading-relaxed italic text-gray-800">
//                     "{item.caption}"
//                   </p>
//                 </div>
                
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//                   <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
//                     <Music size={14} />
//                   </div>
//                   <span className="text-sm font-semibold text-gray-600">{item.song}</span>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// }
