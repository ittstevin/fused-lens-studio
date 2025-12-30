import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { aboutImage } from '../../data/images'
import { AnimatedCounter } from '../Effects'
import './About.css'

import { studioInfo as defaultStudioInfo, stats as defaultStats, timeline as defaultTimeline } from '../../data/content'

const API_URL = import.meta.env.DEV ? '/api' : 'http://localhost:3001/api'

gsap.registerPlugin(ScrollTrigger)

export function About() {
  const [about, setAbout] = useState(null)
  const [studioInfo, setStudioInfo] = useState({
    name: defaultStudioInfo.name,
    founded: defaultStudioInfo.founded
  })
  const [stats, setStats] = useState(defaultStats)
  const [timeline, setTimeline] = useState(defaultTimeline)
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const milestoneRefs = useRef([])

  useEffect(() => {
    // Set default data immediately, then try to fetch from API
    Promise.all([
      fetch(`${API_URL}/content/about`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null),
      fetch(`${API_URL}/content/studio`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null),
      fetch(`${API_URL}/content/stats`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null),
      fetch(`${API_URL}/content/timeline`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null)
    ]).then(([aboutData, studioData, statsData, timelineData]) => {
      if (aboutData) setAbout(aboutData)
      if (studioData) {
        setStudioInfo({
          name: studioData.name || defaultStudioInfo.name,
          founded: studioData.founded || defaultStudioInfo.founded
        })
      }
      if (statsData && Array.isArray(statsData) && statsData.length > 0) {
        setStats(statsData)
      }
      if (timelineData && Array.isArray(timelineData) && timelineData.length > 0) {
        setTimeline(timelineData)
      }
    }).catch(err => console.error('Failed to load about data:', err))
  }, [])

  // Parallax effect on image
  useEffect(() => {
    const image = imageRef.current
    if (!image) return

    gsap.to(image, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  // Timeline animations
  useEffect(() => {
    if (timeline.length === 0) return
    
    const milestones = milestoneRefs.current.filter(Boolean)
    
    milestones.forEach((milestone, index) => {
      gsap.fromTo(milestone,
        { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: milestone,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [timeline])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section id="about" className="about section" ref={sectionRef}>
      <div className="container">
        <div className="about__layout">
          {/* Image Side */}
          <div className="about__image-container">
            <motion.div
              className="about__image-wrapper"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="about__image-inner" ref={imageRef}>
                <img
                  src={aboutImage}
                  alt="Photography studio"
                  className="about__image"
                />
              </div>
              
              {/* Floating badge */}
              <motion.div
                className="about__badge"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className="about__badge-number">{new Date().getFullYear() - studioInfo.founded}+</span>
                <span className="about__badge-text">Years of Excellence</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Content Side */}
          <motion.div
            className="about__content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.span className="section-label" variants={itemVariants}>
              About Us
            </motion.span>
            
            <motion.h2 className="about__title" variants={itemVariants}>
              {about?.title || 'Crafting Visual Masterpieces'}
            </motion.h2>
            
            <motion.p className="about__lead" variants={itemVariants}>
              {about?.content || `At ${studioInfo.name}, we believe every photograph should tell a story that resonates deeply with those who view it.`}
            </motion.p>
            
            <motion.p className="about__text" variants={itemVariants}>
              {about?.story || 'Loading...'}
            </motion.p>

            {/* Animated Stats */}
            <motion.div className="about__stats" variants={itemVariants}>
              {stats.map((stat, index) => (
                <div key={index} className="about__stat">
                  <span className="about__stat-number">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2.5} />
                  </span>
                  <span className="about__stat-label">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="about__timeline">
          <motion.h3
            className="about__timeline-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Journey
          </motion.h3>
          
          <div className="timeline">
            <div className="timeline__line" />
            
            {timeline.map((milestone, index) => (
              <div
                key={milestone.year}
                ref={(el) => (milestoneRefs.current[index] = el)}
                className={`timeline__item ${index % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}
              >
                <div className="timeline__content">
                  <span className="timeline__year">{milestone.year}</span>
                  <h4 className="timeline__heading">{milestone.title}</h4>
                  <p className="timeline__description">{milestone.description}</p>
                </div>
                <div className="timeline__dot">
                  <motion.div
                    className="timeline__dot-inner"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
