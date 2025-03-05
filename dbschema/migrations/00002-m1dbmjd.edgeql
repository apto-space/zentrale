CREATE MIGRATION m1dbmjdtgbuwncmmm23vs3nsbn266hkfekewfkmgtmm4idgfwihyba
    ONTO m1l2z5nwxt636tdjeenxz4qhgoxettnyb5ifvjaivd6exwvc7x6y3a
{
  ALTER TYPE default::Message {
      CREATE CONSTRAINT std::exclusive ON ((.message_conversation, .created_at));
  };
};
