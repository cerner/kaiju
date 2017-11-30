module CoreExtensions
  module DateTime
    module DateTimeExtensions
      def iso8601_precise
        utc.round(10).iso8601(6)
      end
    end
  end
end
