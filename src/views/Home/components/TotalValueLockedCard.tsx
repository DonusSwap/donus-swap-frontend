import React from 'react'
import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import { useFarms, usePriceCakeBusd, usePriceBnbBusd , usePoolFromPid} from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`

const TotalValueLockedCard = () => {
  const { t } = useTranslation()
  // const data = useGetStats()
  // const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null

  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const pool = usePoolFromPid(0)
  let tvl = new BigNumber(0)
  for (let i = 0; i < farmsLP.data.length; i++) {
    const farm = farmsLP.data[i]
    if (!farm.lpTotalInQuoteToken) {
      //
    } else if (farm?.quoteToken?.symbol === QuoteToken.BNB) {
      tvl = tvl.plus(new BigNumber(farm.lpTotalInQuoteToken).div(bnbPrice))
    } else if (farm?.quoteToken?.symbol === QuoteToken.CAKE) {
      tvl = tvl.plus(cakePrice.times(farm.lpTotalInQuoteToken))
    } else {
      tvl = tvl.plus(farm.lpTotalInQuoteToken)
    }
  }
  let total = (Math.round(tvl.toNumber() * 100) / 100)
  // total += getBalanceNumber(cakePrice.times(1))
  total += getBalanceNumber(cakePrice.times(pool.totalStaked))

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading scale="lg" mb="24px">
          {t('Total Value Locked (TVL)')}
        </Heading>
        {total ? (
          <>
            <Heading scale="xl">{`$${total?.toFixed(2)}`}</Heading>
            <Text color="textSubtle">{t('Across all LPs and Syrup Pools')}</Text>
          </>
        ) : (
          <Skeleton height={66} />
        )}
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
