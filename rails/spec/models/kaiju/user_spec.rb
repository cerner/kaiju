require 'rails_helper'

module Kaiju
  describe User do
    before(:context) do
      @user_key = 'herpderp'
      @user = nil
    end
    context 'initialize' do
      it 'should return an object with the supplied id' do
        id = '123'
        user = User.new(id)
        expect(user.id).to eq(id)
      end
    end
    context 'as_json' do
      before(:example) do
        @user = User.new(@user_key)

        @creation_date_time = 'creation_date_time'
        @user.creation_date_time = @creation_date_time

        @name = 'name'
        @user.name = @name

        @email = 'email'
        @user.email = @email

        @nickname = 'nickname'
        @user.nickname = @nickname

        @project1 = '3'
        @project2 = '4'
        @user.projects << @project1
        @user.projects << @project2

        @shared_project1 = '5'
        @shared_project2 = '6'
        @user.shared_projects << @shared_project1
        @user.shared_projects << @shared_project2

        @recent_workspace1 = { 'project' => '1', 'workspace' => '1' }
        @recent_workspace2 = { 'project' => '2', 'workspace' => '2' }
        @user.recent_workspaces[@recent_workspace1.to_json] = 1
        @user.recent_workspaces[@recent_workspace2.to_json] = 2

        @user.changelog_viewed = false
      end
      after(:example) do
        @user.redis.del(@user.redis_objects.keys.map { |k| @user.send(k) }.reject(&:nil?).map(&:key))
      end
      it 'should return a value for each object' do
        user_hash = @user.as_json
        expect(user_hash['creation_date_time']).to eq(@creation_date_time)
        expect(user_hash['name']).to eq(@name)
        expect(user_hash['email']).to eq(@email)
        expect(user_hash['nickname']).to eq(@nickname)
        expect(user_hash['projects']).to eq([@project1, @project2])
        expect(user_hash['shared_projects']).to eq([@shared_project1, @shared_project2])
        expect(user_hash['recent_workspaces']).to eq([@recent_workspace2, @recent_workspace1])
        expect(user_hash['changelog_viewed']).to eq(false)
      end
    end
    context 'add_recent_project' do
      after(:example) do
        @user.redis.del(@user.redis_objects.keys.map { |k| @user.send(k) }.reject(&:nil?).map(&:key))
      end
      it 'should add a recent workspace' do
        @user = User.new(@user_key)
        hash1 = { 'project' => '123', 'workspace' => '321' }
        hash2 = { 'project' => '345', 'workspace' => '543' }
        @user.add_recent_workspace(hash1['project'], hash1['workspace'])
        @user.add_recent_workspace(hash2['project'], hash2['workspace'])
        expect(@user.recent_workspaces.members).to eq([hash1.to_json, hash2.to_json])
        expect(@user.recent_workspaces.rank(hash1.to_json)).to eq(0)
        expect(@user.recent_workspaces.rank(hash2.to_json)).to eq(1)
      end

      it 'should only allow x recent workspaces' do
        @user = User.new(@user_key)
        result = []
        (1..52).each do |item|
          result << { 'project' => item.to_s, 'workspace' => item.to_s }.to_json
          @user.add_recent_workspace(item.to_s, item.to_s)
        end
        result.delete_at(0)
        expect(@user.recent_workspaces.members).to eq(result)
      end
    end
  end
end
