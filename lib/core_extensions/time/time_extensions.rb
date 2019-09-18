module CoreExtensions
  module Time
    module TimeExtensions
      def iso8601_precise
        utc.round(10).iso8601(6)
      end
    end
  end
end
