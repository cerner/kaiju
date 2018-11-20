class HealthController < ApplicationController
  skip_before_action :authenticate

  def index
    begin
      Redis.new.ping
    rescue StandardError => e
      Rails.logger.warn(e)

      return render json: { redis: 'Unavailable' }, status: :service_unavailable
    end

    render json: { redis: 'Available' }, status: :ok
  end
end
