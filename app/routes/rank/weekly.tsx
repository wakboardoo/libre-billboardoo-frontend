import ChartItem from '@components/ChartItem'
import Play50Button from '@components/Play50Button'
import SmallHeader from '@components/SmallHeader'
import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { ChartDataResponse, RankResponse } from '@utils/types'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface LoaderData {
  ranks: RankResponse
  chartData: ChartDataResponse
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const [ranks, chartData] = await Promise.all([
    fetch('https://chart.zvz.be/api/rank/weekly'),
    fetch('https://chart.zvz.be/api/song/chart-data'),
  ])

  return {
    ranks: await ranks.json(),
    chartData: await chartData.json(),
  }
}

const WeeklyRank = () => {
  const { ranks, chartData } = useLoaderData<LoaderData>()
  const buttonsRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (buttonsRef.current) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          headerRef.current?.classList.toggle('hidden', entry.isIntersecting)
          headerRef.current?.classList.toggle('flex', !entry.isIntersecting)
        })
      })

      io.observe(buttonsRef.current)
    }
  }, [])

  const button1to50 = (
    <Play50Button
      key='play1to50'
      start={1}
      end={50}
      list={ranks.ranking.slice(0, 50).map((value) => value.videoIds[0])}
    />
  )

  const button51to100 = (
    <Play50Button
      key='play51to100'
      start={51}
      end={100}
      list={ranks.ranking.slice(50, 100).map((value) => value.videoIds[0])}
    />
  )

  return (
    <>
      <SmallHeader ref={headerRef} title='주간 차트' buttons={[button1to50, button51to100]} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='p-14'
      >
        <h1 className='text-gray-50 text-4xl font-bold'>주간 차트</h1>
        <p className='text-gray-400 text-lg'>{dayjs(ranks.timestamp * 1000).format('M월 D일 a h시')} 업데이트</p>

        <div ref={buttonsRef} className='mt-5 flex gap-3'>
          {button1to50}
          {button51to100}
        </div>

        <span className='h-px w-full bg-neutral-600' aria-hidden='true' />

        <ul className='mt-5 space-y-3'>
          {ranks.ranking.map((item, index) => (
            <li key={item.videoIds[0]}>
              <ChartItem
                id={item.videoIds[0]}
                rank={index + 1}
                rankChange={chartData[item.artist][item.title].previousRank.weekly - (index + 1)}
                title={item.title}
                artist={item.artist}
                count={item.count}
              />
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  )
}

export default WeeklyRank
