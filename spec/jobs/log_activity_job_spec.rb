require 'rails_helper'

RSpec.describe LogActivityJob, type: :job do
  
  subject(:job) { LogActivityJob.new }

  describe '#perform' do
    let(:uri) { URI.parse('http://example.com/webhook') }
    it "logs an activity with a GlobalID" do
      idea = create(:idea)
      user = create(:user)
      expect{job.perform(idea, "created", user, Time.now)}.to change{Activity.count}.from(0).to(1)
    end

    it "logs an activity with a composed deleted resource" do
      idea = create(:idea)
      frozen_idea = idea.destroy
      user = create(:user)
      expect{job.perform("Idea/#{frozen_idea.id}", "created", user, Time.now)}.to change{Activity.count}.from(0).to(1)
    end

    it "enqueues a MakeNotificationsJob" do
      idea = create(:idea)
      user = create(:user)
      expect{job.perform(idea, "created", user, Time.now)}.to have_enqueued_job(MakeNotificationsJob)
    end
  end
end
