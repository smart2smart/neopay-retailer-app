export const set_unit_quantities = (product) => {
    let unit_data = [];
    let units = product["unit_conversion"]
    if (units) {
        if (product["level_0_enabled"]) {
            unit_data.push({label: product["level_0_label"], value: 0, quantity: 1});
            product["selected_unit"] = 0;
            product["unit_label"] = product["level_0_label"];
            product["lot_quantity"] = 1;
        }
        if (product["level_1_enabled"] && units["level_1_unit"]) {
            unit_data.push({
                label: units["level_1_name"] + ` (${units["level_1_qty"]})`,
                value: units["level_1_unit"],
                quantity: units["level_1_qty"],
            })
            if (!product["level_0_enabled"] && units["level_1_unit"]) {
                product["selected_unit"] = units["level_1_unit"];
                product["unit_label"] = units["level_1_name"];
                product["lot_quantity"] = units["level_1_qty"];
            }
        }

        if (product["level_2_enabled"] && units["level_2_unit"]) {
            unit_data.push({
                label: units["level_2_name"] + ` (${units["level_2_qty"]})`,
                value: units["level_2_unit"],
                quantity: units["level_2_qty"]
            })
            if (!product["level_0_enabled"] && !(product["level_1_enabled"] && units["level_1_unit"])  && units["level_2_unit"]) {
                product["selected_unit"] = units["level_2_unit"];
                product["unit_label"] = units["level_2_name"];
                product["lot_quantity"] = units["level_2_qty"];
            }
        }
    } else {
        unit_data.push({label: product["level_0_label"], value: 0, quantity: 1});
        product["selected_unit"] = 0;
        product["unit_label"] = product["level_0_label"];
        product["lot_quantity"] = 1;
    }
    product["lot_size_data"] = unit_data;
}