require 'rails_helper'

RSpec.describe UserConfirmation::SendConfirmationCode do
  subject(:result) { described_class.call(context) }

  let(:context) { {} }

  context 'when the user signs up with a phone number' do
    before do
      enable_phone_login
      context[:user] = create(:user, email: '398234234234')
    end

    it 'is a failure' do
      expect(result).to be_a_failure
    end

    it 'returns a registration_method error, since phones are not confirmable' do
      expect(result.errors[:registration_method]).to be_present
    end
  end

  context 'when the user signs up with an email' do
    before do
      context[:user] = create(:user, email: 'some_email@email.com')
    end

    it 'is successful' do
      expect(result).to be_a_success
    end

    it 'changes the email confirmation code delivery timestamp' do
      expect { result }.to change(context[:user], :email_confirmation_code_sent_at)
    end

    it 'enqueues email delivery job' do
      expect { result }.to enqueue_job(ActionMailer::MailDeliveryJob)
    end

    it 'enqueues a code expiration job' do
      expect { result }.to enqueue_job(UserConfirmation::ExpireConfirmationCodeJob)
    end
  end
end
