export default async function handler(req, res) {
    const { method } = req;
  
    if (method === "GET") {
      const createRating = (ratings) => {
        let result = {};
  
        let totalVotes = 0;
  
        ratings.forEach(({ votes }) => {
          totalVotes += votes;
        });
  
        ratings.forEach(({ rating, votes }) => {
          const percentage = totalVotes !== 0 ? Math.max(0, Math.round((votes / totalVotes) * 100)) : 0;
          const Votes = formatVotesCount(votes);
  
          result[rating] = {
            votes: Votes,
            percentage: percentage,
          };
        });
  
        function formatVotesCount(votes) {
          if (votes >= 1000 && votes < 1000000) {
            return formatNumberWithK(votes, 1000);
          } else if (votes >= 1000000 && votes < 1000000000) {
            return formatNumberWithK(votes, 1000000);
          } else if (votes >= 1000000000) {
            return formatNumberWithK(votes, 1000000000);
          } else {
            return votes.toString();
          }
        }
  
        function formatNumberWithK(value, divisor) {
          const result = Math.floor(value / divisor);
          const remainder = value % divisor;
          const decimal = Math.floor((remainder / divisor) * 10);
  
          if (decimal > 0) {
            return `${result}.${decimal} K`;
          } else {
            return `${result} K`;
          }
        }
  
        const overallAverage =
          totalVotes !== 0
            ? (ratings.reduce((acc, { rating, votes }) => acc + rating * votes, 0) / totalVotes).toFixed(1)
            : 0;
  
        result['average'] = overallAverage;
        result['total'] = totalVotes;
  
        return result;
      };
  
      const ratings = [
        { rating: 5, votes: 5 },
        { rating: 4, votes: 0 },
        { rating: 3, votes: 0 },
        { rating: 2, votes: 2 },
        { rating: 1, votes: 1},
      ];
  
      const result = createRating(ratings);
  
      res.status(200).json(result);
    }
  }