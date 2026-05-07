import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const teachingData = [
  { name: 'Reconciliation', value: 35, color: '#C0A060' },
  { name: 'Leadership', value: 25, color: '#1B263B' },
  { name: 'Prophetic', value: 20, color: '#415A77' },
  { name: 'Humanitarian', value: 20, color: '#778DA9' },
];

const impactData = [
  { year: '2020', reach: 5000 },
  { year: '2021', reach: 12000 },
  { year: '2022', reach: 25000 },
  { year: '2023', reach: 45000 },
  { year: '2024', reach: 75000 },
];

const humanitarianMetrics = [
  { category: 'Clean Water', count: 15, unit: 'Boreholes' },
  { category: 'Food Support', count: 850, unit: 'Families' },
  { category: 'Education', count: 12, unit: 'Labs' },
  { category: 'Shelter', count: 100, unit: 'Beds' },
];

export default function ImpactVisualizations() {
  return (
    <section className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-6 block"
          >
            Data & Testimony
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-serif text-primary mb-8"
          >
            Visualizing the <span className="gold-gradient-text italic font-normal">Mandate</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Beyond the spoken word, the Apostolic Mandate produces measurable fruit. These metrics reflect our commitment to systemic transformation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Chart 1: Teaching Distribution */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl"
          >
            <h3 className="text-2xl font-serif text-primary mb-8 border-l-4 border-secondary pl-6">Teaching Focus</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teachingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {teachingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-8 text-xs text-slate-400 font-mono text-center uppercase tracking-widest">Apostolic Curriculum Distribution (%)</p>
          </motion.div>

          {/* Chart 2: Global Reach Growth */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl"
          >
            <h3 className="text-2xl font-serif text-primary mb-8 border-l-4 border-secondary pl-6">Impact Growth</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={impactData}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C0A060" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C0A060" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reach" 
                    stroke="#C0A060" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorReach)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-8 text-xs text-slate-400 font-mono text-center uppercase tracking-widest">Cumulative Souls Impacted Globally</p>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {humanitarianMetrics.map((metric, idx) => (
            <motion.div
              key={metric.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-primary p-8 rounded-3xl text-center border border-white/5"
            >
              <div className="text-3xl sm:text-4xl font-serif text-secondary mb-2">{metric.count}+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{metric.category}</div>
              <div className="text-[9px] text-slate-500 italic uppercase">{metric.unit}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
