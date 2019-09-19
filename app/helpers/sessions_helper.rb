module SessionsHelper
  # Public: Adds the user to the current session
  def login(user)
    session[:user_id] = user.id
    session[:_csrf_token] ||= SecureRandom.base64(32)
  end

  # Public: Removes the current user from the session
  def logout
    session[:user_id] = nil
  end

  # Public: Returns the current user stored in the session
  def current_user
    Kaiju::User.by_id(session[:user_id])
  end
end
