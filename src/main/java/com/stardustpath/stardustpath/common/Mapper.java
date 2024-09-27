package com.stardustpath.stardustpath.common;

import com.stardustpath.stardustpath.modules.assets.item.models.AssetItemEntity;
import com.stardustpath.stardustpath.modules.assets.item.models.GetAssetItemDto;
import com.stardustpath.stardustpath.modules.assets.item.models.PostAssetItemDto;
import com.stardustpath.stardustpath.modules.assets.transaction.models.AssetTransactionEntity;
import com.stardustpath.stardustpath.modules.assets.transaction.models.PostAssetTransactionDto;
import com.stardustpath.stardustpath.modules.auth.models.RegisterDto;
import com.stardustpath.stardustpath.modules.auth.models.User;
import com.stardustpath.stardustpath.modules.budgets.models.BudgetEntity;
import com.stardustpath.stardustpath.modules.budgets.models.PostBudgetDto;
import com.stardustpath.stardustpath.modules.categories.models.CategoryEntity;
import com.stardustpath.stardustpath.modules.categories.models.PostCategoryDto;
import com.stardustpath.stardustpath.modules.notifications.models.NotificationEntity;
import com.stardustpath.stardustpath.modules.notifications.models.PostNotificationDto;
import com.stardustpath.stardustpath.modules.recurrings.models.PostRecurringDto;
import com.stardustpath.stardustpath.modules.recurrings.models.RecurringEntity;
import com.stardustpath.stardustpath.modules.reminders.models.PostReminderDto;
import com.stardustpath.stardustpath.modules.reminders.models.ReminderEntity;
import com.stardustpath.stardustpath.modules.transactions.models.PostTransactionDto;
import com.stardustpath.stardustpath.modules.transactions.models.TransactionEntity;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@org.mapstruct.Mapper
public interface Mapper {
    Mapper INSTANCE = Mappers.getMapper(Mapper.class);

    CategoryEntity postDtoToEntity(PostCategoryDto dto, @MappingTarget CategoryEntity entity);
    CategoryEntity postDtoToEntity(PostCategoryDto dto);

    TransactionEntity postDtoToEntity(PostTransactionDto dto, @MappingTarget TransactionEntity entity);
    TransactionEntity postDtoToEntity(PostTransactionDto dto);

    RecurringEntity postDtoToEntity(PostRecurringDto dto, @MappingTarget RecurringEntity entity);
    RecurringEntity postDtoToEntity(PostRecurringDto dto);

    BudgetEntity postDtoToEntity(PostBudgetDto dto, @MappingTarget BudgetEntity entity);
    BudgetEntity postDtoToEntity(PostBudgetDto dto);

    AssetItemEntity postDtoToEntity(PostAssetItemDto dto, @MappingTarget AssetItemEntity entity);
    AssetItemEntity postDtoToEntity(PostAssetItemDto dto);

    AssetTransactionEntity postDtoToEntity(PostAssetTransactionDto dto, @MappingTarget AssetTransactionEntity entity);
    AssetTransactionEntity postDtoToEntity(PostAssetTransactionDto dto);

    GetAssetItemDto entityToDto(AssetItemEntity entity, @MappingTarget GetAssetItemDto dto);
    GetAssetItemDto entityToDto(AssetItemEntity entity);

    ReminderEntity postDtoToEntity(PostReminderDto dto, @MappingTarget ReminderEntity entity);
    ReminderEntity postDtoToEntity(PostReminderDto dto);

    NotificationEntity postDtoToEntity(PostNotificationDto dto, @MappingTarget NotificationEntity entity);
    NotificationEntity postDtoToEntity(PostNotificationDto dto);

    User registerDtoToUser(RegisterDto dto, @MappingTarget User entity);
    User registerDtoToUser(RegisterDto dto);
}
