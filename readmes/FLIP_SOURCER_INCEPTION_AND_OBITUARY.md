# Flip Sourcer Inception and Obituary

My name is Kelvan Brandt, you can find me on LinkedIn here or on [GitHub here](https://github.com/kelvanb97). I am a 27-year-old Software Engineer currently based in Bellingham Washington. When I am not coding you'll likely find me hiking or mountain biking, weather permitting. 

As long as I can remember I’ve had an eye for innovation which ultimately led me to creating my own startup. Hence the inception of Flip Sourcer. Many years ago I was a 3rd party seller primarily using the Amazon platform. I started selling on Amazon with full intentions of finding a problem worth solving as a startup venture. After about a year I had laid out many options. The two largest pain points (although there were many) I found while selling on Amazon, were as follows: Bookkeeping and sourcing more profitable leads.

I chose to solve the `More Profitable Leads`(MPL) problem. This is largely due to the fact that after theory crafting some initial solutions to each problem, the potential solutions to the MPL problem were infinitely more technically appealing as well as a universal 3rd party Amazon seller issue. From a technical and business perspective I was happy to start solving this problem of sourcing more profitable leads.

### The MVP

I know this may technically be backward to the norm but I started building out a minimum viable product prior to doing competitor research. I had two high-level solutions in my head that I didn’t want to bias by doing competitor research. In the beginning, I just wanted to build a hacky MVP and get it into the hands of a small set of users, then get their feedback. So I started coding. The initial MVP was branded as Pro Arbitrage Online, which ended up being a name I disliked so much that I ended up rebranding months later. It was a basic web app plus a Chrome Extension where the extension enabled users to compare product listings from an initial 30 supported sites (Walmart, Costco, etc) to Amazon. It was unarguably `rough around the edges` but that was the point. I wanted feedback on the idea itself, not necessarily the implementation at this point. It did have fantastic error handling though because pretty much every piece of the software could break for reasons that were out of my control. A website could have a different catalog page structure than I had anticipated, the Amazon data API I was using at the time was the cheapest option and broke a lot (I opted to buy, not build early in the project). It wasn’t pretty but it was an MVP and that is all I needed to get user feedback. Keep in mind that at the time the product was free. I took around a week off of development and focussed on collecting user feedback. And the feedback was overwhelmingly positive… for now.

It is worth noting that now that I had completed the unbiased MVP I backstepped and did a fair bit of competitor research. Given that I had been an Amazon seller myself for a long time at this point my findings were not surprising. There weren’t many companys doing what I was doing which gives mixed signals. On one hand, I may not be solving a problem that is worth solving. But the big players were multi-million dollar companies which was pretty much a guarantee because their fundraising information was partially public. On the other hand, it could just mean low competition. Spoiler alert it ended up meaning: Extremely expensive and difficult problem to solve, emphasis on expensive.

Continuing on past my competitor research I now started working on the paid version of the MVP. There weren’t any major differences in features other than I was now charging $20 per month per user. I also made some updates to the authentication system. This didn’t take me more than a few days to implement. I merged my pull request into `main` and made an email and discord announcement to notify my users. I then went to sleep. When I woke up all seemed fine, of the 40 or so alpha users I was in constant communication with most of them opted to start paying for the service. It took an additional two weeks before my next big obstacle would arise.

### The Churn

Come 2 weeks later after monetizing I really hadn’t been doing any feature development, I spent most of my time speaking with users and cleaning up the codebase to be ready for what the next feature request may be. At this point in time I had close to two years of runway and I had no intentions of unnecessarily rushing things. After close to one hundred customer conversations, many repeat conversations with the same groups of users I started to gather the sense that there was a problem. There was an apparent skill gap in the product. A small subset of users would report happiness with the product as they had spent $20 to make upwards of $1,000. But the majority of users reported that it didn’t help them and they felt like the product was a distraction to Retail Arbitrage (RA). At the time I didn’t understand that Online Arbitrage (OA) had such a skill gap when compared to RA. Getting to the point, all but four of my paying customers had churned.

### The Skill Gap

When I did some more research on my now four paying customers they all had organizations that had over seven figures per year in revenue on Amazon while some of the churned users were hitting early milestones like “First 10k month” or “First 10k ever.” Once again I didn’t see this as any reason to throw in the towel but rather a small speedbump in need of a solution. I got my facts straight and laid out my options. I noticed that the value I was providing my now four paying customers was tremendous and they all made verbal commitments to me that they had no intentions of leaving the platform. But it was rather evident at this point that the platform I had created was !! EXPERT ONLY  !!

### My Options

Laying out my potential solutions:

1. Double down on having an expert-only platform
2. Provide learning resources to lower the skill gap
3. Create features to lower the skill gap

### My Choice

I didn’t want to build an expert-only platform because part of my mission was to help Amazon seller newbies. I also had no desire to provide learning resources to lower the skill gap, I felt like this would have required a larger founding team with a heavy emphasis on nurturing a social following. I also didn’t want to sell a “course.” I ended up going with option three: Create features to lower the skill gap. Hindsight being 20/20 I now see where I went wrong. There is nothing wrong with creating features to lower the skill gap. It is practiced by most successful companies. But building any feature has its risks and the level of risk is a spectrum.

### My Mistake

I opted to start from scratch and rebuild the entire platform, to build the best version of the platform. While it may have been the more technically interesting decision it was a bad business decision and ultimately this decision would end up being the downfall of Flip Sourcer. I could write a long novel on just the reasons why this pivot was so poorly strategic but I’ll just list a few:

- It was easy to convert people at $20 per month
- I had time to work on the product and speak with the community
- I had a large community following and Discord admins of various other channels really liked what I was doing.
- People could choose what products they scraped
- etc
- etc

### An Impossible Adventure

- Complexity to build an MVP ~6 months
- Scraping challenges
- Product too good causing product buy outs (supply being consumed by single user)
- Monetization issues
- etc
- etc

To be continued …
