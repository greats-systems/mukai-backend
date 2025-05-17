import { UpdateDemandOrderDto } from "src/orders/dto/update-order.dto";

// src/common/helpers/string.helper.ts
export class StringHelper {
    static capitalize(input?: string): string {
        if (!input || input.length === 0) return '';
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
    static getOrderTitle(order: UpdateDemandOrderDto): string {
        const itemName = order.item?.name;
        const baseTitle = 'Demand Response';

        return itemName
            ? `${StringHelper.capitalize(itemName)} ${baseTitle}`
            : `New ${baseTitle}`;
    }
}

