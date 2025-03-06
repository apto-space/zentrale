module default {
    # using qualified names to prevent confusion / create 'typing'

    type Conversation extending Timestamped {
        required conversation_anon_user_id: str;
        # messages split up in case conversations get very long
        required conversation_messages:= assert_exists(.<message_conversation[is Message]);
        required conversation_message_count:= count(.conversation_messages)
    }

    type Message extending Timestamped {
        required message_conversation: Conversation {on target delete delete source};
        required message_content: str;
        required message_role: str;
        constraint exclusive on ((.message_conversation, .created_at));
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
