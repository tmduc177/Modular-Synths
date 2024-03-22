import { defaults } from "../default-values.js"

grid_size = defaults.grid_size

export function forceDialConstraints(panel_w, panel_h, grid_size = grid_size) {
    var knob_radius_factor = defaults.dial.knob_radius_factor
    var outer_ring_size_factor = defaults.dial.outer_ring_size_factor
    var notch_distance_factor = defaults.dial.notch_distance_factor
    var mark_size_factor = defaults.dial.mark_size_factor
    var mark_quantity = defaults.dial.mark_quantity
    var mark_stretch_factor = defaults.dial.mark_stretch_factor
    var tick_size_factor = defaults.dial.tick_size_factor
    return {
        knob_radius_factor: knob_radius_factor,
        outer_ring_size_factor: outer_ring_size_factor,
        notch_distance_factor: notch_distance_factor,
        mark_size_factor: mark_size_factor,
        tick_size_factor
    }
}

