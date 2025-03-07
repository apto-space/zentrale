CREATE MIGRATION m1jy7y6rz7kzbu5lso3c7ad7zpxtgr6ubbbej3ag4rlvbgdm4xlx3q
    ONTO m1v4boaqzujnezoj23hixk5bdq26olub4h6oxqq4zxya77tavreona
{
  ALTER TYPE default::Conversation {
      ALTER PROPERTY title {
          RENAME TO conversation_title;
      };
  };
};
