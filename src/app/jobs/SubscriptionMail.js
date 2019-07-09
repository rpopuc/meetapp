import Mail from '../../lib/Mail';

class SubscriptionMail {

  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { subscription } = data;
    const { meetup, user } = subscription;

    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: `[${meetup.title}] Nova inscrição`,
      template: 'subscription',
      context: {
        organizer: meetup.user.name,
        meetup: meetup.title,
        user: user.name,
        email: user.email,
      },
    });
  }
}

export default new SubscriptionMail();
