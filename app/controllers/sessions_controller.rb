class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :create
  skip_before_action :authenticate

  include ::SessionsHelper

  def index
    strategies = OmniAuth.active_strategies.map do |strategy|
      {
        provider: strategy,
        url: "#{request.base_url}/auth/#{strategy}?origin=#{params[:origin]}"
      }
    end
    return redirect_to(strategies[0][:url]) if strategies.count == 1

    render json: JSON.pretty_generate(strategies)
  end

  def create
    auth = request.env['omniauth.auth']
    info = auth[:info]
    user = Kaiju::UserFactory.new_user(auth[:uid],
                                       info[:name],
                                       info[:email],
                                       info[:nickname])
    login(user)

    redirect_to request.env['omniauth.origin'] || '/'
  end

  def failure
    redirect_to request.env['omniauth.origin'] || '/'
  end

  def destroy
    logout

    send_file Rails.root.join('public', 'check.gif'), type: 'image/gif', disposition: 'inline'
  end
end
