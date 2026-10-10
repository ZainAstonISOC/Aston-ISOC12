// Puts an audio track under a video without re-encoding either (passthrough).
//   swift mux.swift <video.mp4> <audio.m4a> <out.mp4>
import AVFoundation
import Foundation

let a = CommandLine.arguments
guard a.count == 4 else { FileHandle.standardError.write("usage: mux.swift <video.mp4> <audio.m4a> <out.mp4>\n".data(using: .utf8)!); exit(2) }
let video = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let audio = AVURLAsset(url: URL(fileURLWithPath: a[2]))
let out = URL(fileURLWithPath: a[3])
try? FileManager.default.removeItem(at: out)

let sem = DispatchSemaphore(value: 0)
Task {
  do {
    let comp = AVMutableComposition()
    let vTrack = try await video.loadTracks(withMediaType: .video)[0]
    let aTrack = try await audio.loadTracks(withMediaType: .audio)[0]
    let vDur = try await video.load(.duration)
    let range = CMTimeRange(start: .zero, duration: vDur)
    let cv = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
    try cv.insertTimeRange(range, of: vTrack, at: .zero)
    cv.preferredTransform = try await vTrack.load(.preferredTransform)
    let ca = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
    let aDur = try await audio.load(.duration)
    try ca.insertTimeRange(CMTimeRange(start: .zero, duration: CMTimeMinimum(vDur, aDur)), of: aTrack, at: .zero)
    guard let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetPassthrough) else { fatalError("no export session") }
    ex.shouldOptimizeForNetworkUse = true
    try await ex.export(to: out, as: .mp4)
    print("muxed → \(out.lastPathComponent)")
  } catch { fatalError("mux failed: \(error)") }
  sem.signal()
}
sem.wait()
