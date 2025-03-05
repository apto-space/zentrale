module default {
    # using qualified names to prevent confusion / create 'typing'

    type Conversation extending Timestamped {
        required conversation_anon_user_id: str {constraint exclusive};
        # messages split up in case conversations get very long
        required conversation_messages:= assert_exists(.<message_conversation[is Message]);
    }

    type Message extending Timestamped {
        required message_conversation: Conversation;
        required message_content: json;
        required message_role: str;
    }

    abstract type Timestamped {
      required created_at: datetime {
        default := datetime_of_statement();
      }
      updated_at: datetime {
        default := datetime_of_statement();
        rewrite insert, update using (datetime_of_statement())
      }
    }

}
