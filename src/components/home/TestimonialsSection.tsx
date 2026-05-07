import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Quote, User, MapPin } from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location?: string;
  affiliation?: string;
  category?: string;
}

const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "Apostle Sunday's teachings have fundamentally shifted my understanding of the Apostolic Mandate. His clarity and depth are truly transformative.",
    author: "Rev Zion Iyamu",
    location: "Ogun, Nigeria",
    affiliation: "Africa Regional Coordinator"
  },
  {
    id: '2',
    quote: "The Global School of Ministry (GSOM) isn't just a school; it's an encounter. I graduated with not just knowledge, but a clear prophetic blueprint for my calling.",
    author: "Sarah Jenkins",
    location: "London, UK",
    affiliation: "GSOM Alumna"
  },
  {
    id: '3',
    quote: "Through the TRASS humanitarian efforts, I've seen the love of Christ manifested in real, systemic ways. This is the Gospel in action.",
    author: "Dr. James Wilson",
    location: "Accra, Ghana",
    affiliation: "Medical Missionary"
  }
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const q = query(
          collection(db, 'testimonials'),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Testimonial[];
        
        if (fetched.length > 0) {
          setTestimonials(fetched);
        } else {
          setTestimonials(STATIC_TESTIMONIALS);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials(STATIC_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="py-24 bg-white flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-secondary/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-6 block"
          >
            Testimonies
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-serif text-primary mb-8"
          >
            Voice of the <span className="gold-gradient-text italic font-normal text-5xl sm:text-7xl">Equipped</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed"
          >
            From global cities to remote villages, the impact of the Apostolic Mandate resonates through lives transformed by truth and power.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-secondary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/5"
              >
                <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote size={60} className="text-secondary" />
                </div>
                
                <div className="relative z-10">
                  <p className="text-slate-600 text-lg leading-relaxed mb-8 italic font-light">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-secondary">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif text-primary text-xl">{testimonial.author}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">
                        {testimonial.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-secondary" />
                            {testimonial.location}
                          </span>
                        )}
                        {testimonial.location && testimonial.affiliation && <span className="text-slate-300">|</span>}
                        {testimonial.affiliation && (
                          <span>{testimonial.affiliation}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-secondary/5 rounded-br-[2.5rem] pointer-events-none overflow-hidden">
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-secondary/20 rounded-br-xl"></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-1 rounded-full bg-slate-100 border border-slate-200">
            <div className="px-6 py-2 bg-white rounded-full flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center">
                    <User size={14} className="text-slate-400" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-primary uppercase tracking-tighter">
                Joined by over <span className="text-secondary">45,000+</span> witnesses globally
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
